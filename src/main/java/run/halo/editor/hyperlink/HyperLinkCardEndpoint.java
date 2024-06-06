package run.halo.editor.hyperlink;

import static org.springdoc.core.fn.builders.apiresponse.Builder.responseBuilder;

import lombok.RequiredArgsConstructor;
import org.springdoc.webflux.core.fn.SpringdocRouteBuilder;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import org.springframework.web.server.ServerWebInputException;
import reactor.core.publisher.Mono;
import run.halo.app.core.extension.endpoint.CustomEndpoint;
import run.halo.app.extension.GroupVersion;
import run.halo.app.infra.utils.PathUtils;
import run.halo.editor.hyperlink.dto.HyperLinkBaseDTO;
import run.halo.editor.hyperlink.service.HyperLinkCardService;

/**
 * @author LIlGG
 */
@Component
@RequiredArgsConstructor
public class HyperLinkCardEndpoint implements CustomEndpoint {

    private final HyperLinkCardService hyperLinkCardService;

    @Override
    public RouterFunction<ServerResponse> endpoint() {
        final var tag = groupVersion().toString() + "/link";
        return SpringdocRouteBuilder.route()
            .GET("link-detail", this::getHyperLinkDetail, builder -> {
                builder.operationId("GetHyperLinkDetail")
                    .description("Get hyper link detail.")
                    .tag(tag)
                    .response(responseBuilder().implementation(HyperLinkBaseDTO.class));
            })
            .build();
    }

    private Mono<ServerResponse> getHyperLinkDetail(ServerRequest request) {
        final var url = request.queryParam("url")
            .filter(PathUtils::isAbsoluteUri)
            .orElseThrow(() -> new ServerWebInputException("Invalid url."));
        return hyperLinkCardService.getHyperLinkDetail(url)
            .flatMap(dto -> ServerResponse.ok().bodyValue(dto));
    }

    @Override
    public GroupVersion groupVersion() {
        return new GroupVersion("api.hyperlink.halo.run", "v1alpha1");
    }
}
