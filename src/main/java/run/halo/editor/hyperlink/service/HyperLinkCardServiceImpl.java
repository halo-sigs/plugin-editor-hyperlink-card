package run.halo.editor.hyperlink.service;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import java.net.URI;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebInputException;
import reactor.core.publisher.Mono;
import run.halo.app.infra.utils.PathUtils;
import run.halo.editor.hyperlink.HyperLinkRequest;
import run.halo.editor.hyperlink.dto.HyperLinkBaseDTO;
import run.halo.editor.hyperlink.handler.HyperLinkParserFactory;

/**
 * @author LIlGG
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class HyperLinkCardServiceImpl implements HyperLinkCardService {

    private final HyperLinkRequest request;

    private final HyperLinkParserFactory parserFactory;

    private final Cache<String, HyperLinkBaseDTO> hyperLinkCache = CacheBuilder.newBuilder()
        .expireAfterWrite(12, TimeUnit.HOURS)
        .build();

    @Override
    public Mono<HyperLinkBaseDTO> getHyperLinkDetail(String linkUrl) {
        URI uri = URI.create(linkUrl);
        var cacheHyperLink = hyperLinkCache.getIfPresent(linkUrl);
        if (Objects.nonNull(cacheHyperLink)) {
            return Mono.just(cacheHyperLink);
        }
        return parserFactory.getParser(uri.getHost()).parse(uri)
            .doOnNext(hyperLinkBaseDTO -> {
                hyperLinkCache.put(linkUrl, hyperLinkBaseDTO);
            });
    }
}
