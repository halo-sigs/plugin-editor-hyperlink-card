package run.halo.editor.hyperlink;

import java.net.Inet4Address;
import java.net.Inet6Address;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.UnknownHostException;
import java.util.Locale;
import org.springframework.web.server.ServerWebInputException;

public final class UrlSafetyValidator {

    private UrlSafetyValidator() {
    }

    public static URI requireSafeHttpUrl(String rawUrl) {
        URI uri;
        try {
            uri = URI.create(rawUrl);
        } catch (IllegalArgumentException e) {
            throw new ServerWebInputException("Invalid url.");
        }
        return requireSafeHttpUrl(uri);
    }

    public static URI requireSafeHttpUrl(URI uri) {
        if (uri == null || !isHttpScheme(uri) || uri.getHost() == null
            || uri.getRawUserInfo() != null) {
            throw new ServerWebInputException("Invalid url.");
        }

        String host = normalizeHost(uri.getHost());
        if (host.equals("localhost") || host.endsWith(".localhost")) {
            throw new ServerWebInputException("Invalid url.");
        }

        InetAddress[] addresses;
        try {
            addresses = InetAddress.getAllByName(host);
        } catch (UnknownHostException e) {
            throw new ServerWebInputException("Invalid url.");
        }

        for (InetAddress address : addresses) {
            if (!isPublicAddress(address)) {
                throw new ServerWebInputException("Invalid url.");
            }
        }
        return uri;
    }

    public static boolean isSafeHttpUrl(URI uri) {
        try {
            requireSafeHttpUrl(uri);
            return true;
        } catch (ServerWebInputException e) {
            return false;
        }
    }

    private static boolean isHttpScheme(URI uri) {
        String scheme = uri.getScheme();
        return "http".equalsIgnoreCase(scheme) || "https".equalsIgnoreCase(scheme);
    }

    private static String normalizeHost(String host) {
        String normalized = host.toLowerCase(Locale.ROOT);
        if (normalized.endsWith(".")) {
            return normalized.substring(0, normalized.length() - 1);
        }
        return normalized;
    }

    static boolean isPublicAddress(InetAddress address) {
        if (address.isAnyLocalAddress() || address.isLoopbackAddress()
            || address.isLinkLocalAddress() || address.isSiteLocalAddress()
            || address.isMulticastAddress()) {
            return false;
        }
        if (address instanceof Inet4Address inet4Address) {
            return isPublicIpv4Address(inet4Address);
        }
        if (address instanceof Inet6Address inet6Address) {
            return isPublicIpv6Address(inet6Address);
        }
        return false;
    }

    static boolean isPublicSocketAddress(InetSocketAddress address) {
        return !address.isUnresolved() && isPublicAddress(address.getAddress());
    }

    private static boolean isPublicIpv4Address(Inet4Address address) {
        byte[] bytes = address.getAddress();
        int first = Byte.toUnsignedInt(bytes[0]);
        int second = Byte.toUnsignedInt(bytes[1]);
        return !(first == 100 && second >= 64 && second <= 127);
    }

    private static boolean isPublicIpv6Address(Inet6Address address) {
        byte[] bytes = address.getAddress();
        int first = Byte.toUnsignedInt(bytes[0]);
        return (first & 0xfe) != 0xfc;
    }
}
