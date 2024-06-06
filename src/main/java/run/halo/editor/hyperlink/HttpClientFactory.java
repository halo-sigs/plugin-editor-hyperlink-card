package run.halo.editor.hyperlink;

import java.time.Duration;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;
import reactor.netty.transport.ProxyProvider;
import run.halo.app.plugin.ReactiveSettingFetcher;

@Component
@RequiredArgsConstructor
public class HttpClientFactory {

    private final ReactiveSettingFetcher settingFetcher;

    public Mono<HttpClient> createHttpClientBuilder(String host) {
        return settingFetcher.fetch("proxy", ProxyConfig.class)
            .map(proxyConfig -> {
                if (isProxy(proxyConfig, host)) {
                    return getHttpClient()
                        .proxy(proxy ->
                            proxy.type(ProxyProvider.Proxy.HTTP)
                                .host(proxyConfig.host())
                                .port(proxyConfig.port()));
                }
                return getHttpClient();
            });
    }

    private static boolean isProxy(ProxyConfig proxyConfig, String host) {
        if (proxyConfig == null) {
            return false;
        }

        if (!StringUtils.hasText(proxyConfig.host()) && proxyConfig.port() <= 0) {
            return false;
        }

        return !CollectionUtils.isEmpty(proxyConfig.hosts)
            && proxyConfig.hosts.stream()
            .anyMatch(addressConfig -> host.contains(addressConfig.value));
    }

    private static HttpClient getHttpClient() {
        return HttpClient.create()
            .responseTimeout(Duration.ofSeconds(10));
    }

    record ProxyConfig(String host, int port, List<AddressConfig> hosts) {
    }

    record AddressConfig(String value) {
    }
}
