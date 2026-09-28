package run.halo.editor.hyperlink.service;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import java.net.URI;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;
import run.halo.editor.hyperlink.LinkFetchPolicy;
import run.halo.editor.hyperlink.UrlSafetyValidator;
import run.halo.editor.hyperlink.dto.HyperLinkBaseDTO;
import run.halo.editor.hyperlink.handler.HyperLinkParserFactory;

/**
 * @author LIlGG
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class HyperLinkCardServiceImpl implements HyperLinkCardService {

    private final HyperLinkParserFactory parserFactory;

    private final Cache<String, HyperLinkBaseDTO> hyperLinkCache = CacheBuilder.newBuilder()
        .expireAfterWrite(12, TimeUnit.HOURS)
        .build();

    @Override
    public Mono<HyperLinkBaseDTO> getHyperLinkDetail(String linkUrl, LinkFetchPolicy policy, boolean refresh) {
        return Mono.fromRunnable(() -> policy.requireAllowed(URI.create(linkUrl)))
            .then(UrlSafetyValidator.requireSafeHttpUrlAsync(linkUrl))
            .flatMap(uri -> {
                var cacheHyperLink = hyperLinkCache.getIfPresent(linkUrl);
                if (!refresh && Objects.nonNull(cacheHyperLink)) {
                    return Mono.just(cacheHyperLink);
                }
                return parserFactory.getParser(uri.getHost()).parse(uri, policy)
                    .doOnNext(hyperLinkBaseDTO -> hyperLinkCache.put(linkUrl, hyperLinkBaseDTO));
            })
            .onErrorMap(WebClientRequestException.class, error ->
                error.getCause() instanceof ResponseStatusException ? error.getCause() : error);
    }
}
