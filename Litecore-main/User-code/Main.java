
import java.util.*;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

public class Main {

    private static Map<String, String> tokenStore = new HashMap<>();

    public static void main(String[] args) {

        DBInitializer.initialize();
        LiteCore app = new LiteCore();

        // ------------------------------------------------------------
        // GLOBAL LOG + LATENCY MIDDLEWARE
        // ------------------------------------------------------------
        app.use((req, res, next) -> {
            System.out.println("[LOG] " + req.method + " " + req.path);
            long start = System.nanoTime();
            next.run();
            long end = System.nanoTime();
            System.out.println("[LATENCY] " + req.method + " " + req.path +
                    " = " + ((end - start) / 1_000_000.0) + " ms");
        });

        // ------------------------------------------------------------
        // AUTH MIDDLEWARE
        // ------------------------------------------------------------
        LiteCore.Middleware auth = (req, res, next) -> {
            String token = req.headers.get("Authorization");
            if (token == null || !tokenStore.containsKey(token)) {
                res.status(401).json("{\"error\":\"Unauthorized\"}");
                return;
            }
            req.user = tokenStore.get(token);
            next.run();
        };

        // ------------------------------------------------------------
        // REGISTER
        // ------------------------------------------------------------
        app.post("/register", (req, res) -> {
            Map<String, String> form = parseForm(req.body);
            String username = form.get("username");
            String password = form.get("password");

            if (username == null || password == null) {
                res.status(400).json("{\"error\":\"Missing fields\"}");
                return;
            }

            try (Connection conn = DBPool.getConnection()) {

                PreparedStatement check = conn.prepareStatement(
                        "SELECT id FROM users WHERE username=?");
                check.setString(1, username);
                ResultSet rs = check.executeQuery();

                if (rs.next()) {
                    res.status(409).json("{\"error\":\"User exists\"}");
                    return;
                }

                PreparedStatement stmt = conn.prepareStatement(
                        "INSERT INTO users(username, password) VALUES (?,?)");
                stmt.setString(1, username);
                stmt.setString(2, hash(password));
                stmt.executeUpdate();

                res.json("{\"status\":\"success\"}");

            } catch (Exception e) {
                res.status(500).json("{\"error\":\"DB error\"}");
            }
        });

        // ------------------------------------------------------------
        // LOGIN
        // ------------------------------------------------------------
        app.post("/login", (req, res) -> {
            Map<String, String> form = parseForm(req.body);
            String username = form.get("username");
            String password = form.get("password");

            try (Connection conn = DBPool.getConnection()) {

                PreparedStatement stmt = conn.prepareStatement(
                        "SELECT * FROM users WHERE username=? AND password=?");
                stmt.setString(1, username);
                stmt.setString(2, hash(password));

                ResultSet rs = stmt.executeQuery();

                if (rs.next()) {
                    String token = generateToken();
                    tokenStore.put(token, username);
                    res.json("{\"status\":\"success\",\"token\":\"" + token + "\"}");
                } else {
                    res.status(401).json("{\"error\":\"Invalid credentials\"}");
                }

            } catch (Exception e) {
                res.status(500).json("{\"error\":\"DB error\"}");
            }
        });

        // ------------------------------------------------------------
        // VIEW CART
        // ------------------------------------------------------------
        app.get("/cart", auth, (req, res) -> {
            try (Connection conn = DBPool.getConnection()) {

                int userId = getUserId(conn, req.user);

                PreparedStatement stmt = conn.prepareStatement(
                        "SELECT product FROM cart WHERE user_id=?");
                stmt.setInt(1, userId);
                ResultSet rs = stmt.executeQuery();

                StringBuilder sb = new StringBuilder("[");
                boolean first = true;

                while (rs.next()) {
                    if (!first) sb.append(",");
                    first = false;
                    sb.append("{\"product\":\"")
                      .append(rs.getString("product"))
                      .append("\"}");
                }

                sb.append("]");
                res.json(sb.toString());

            } catch (Exception e) {
                res.status(500).json("{\"error\":\"DB error\"}");
            }
        });

        // ------------------------------------------------------------
        // SEARCH CART 🔥 (REQUIRED FOR Cart.jsx)
        // ------------------------------------------------------------
        app.get("/cart/search", auth, (req, res) -> {
            String q = req.query.get("q");
            if (q == null || q.trim().isEmpty()) {
                res.json("[]");
                return;
            }

            try (Connection conn = DBPool.getConnection()) {

                int userId = getUserId(conn, req.user);

                PreparedStatement stmt = conn.prepareStatement(
                        "SELECT product FROM cart WHERE user_id=? AND product LIKE ?");
                stmt.setInt(1, userId);
                stmt.setString(2, "%" + q + "%");

                ResultSet rs = stmt.executeQuery();

                StringBuilder sb = new StringBuilder("[");
                boolean first = true;

                while (rs.next()) {
                    if (!first) sb.append(",");
                    first = false;
                    sb.append("{\"product\":\"")
                      .append(rs.getString("product"))
                      .append("\"}");
                }

                sb.append("]");
                res.json(sb.toString());

            } catch (Exception e) {
                res.status(500).json("{\"error\":\"DB error\"}");
            }
        });

        // ------------------------------------------------------------
        // ADD TO CART
        // ------------------------------------------------------------
        app.post("/cart/add", auth, (req, res) -> {
            Map<String, String> form = parseForm(req.body);
            String product = form.get("product");

            if (product == null || product.isEmpty()) {
                res.status(400).json("{\"error\":\"Missing product\"}");
                return;
            }

            try (Connection conn = DBPool.getConnection()) {

                int userId = getUserId(conn, req.user);

                PreparedStatement stmt = conn.prepareStatement(
                        "INSERT INTO cart(user_id, product) VALUES (?,?)");
                stmt.setInt(1, userId);
                stmt.setString(2, product);
                stmt.executeUpdate();

                res.json("{\"status\":\"success\"}");

            } catch (Exception e) {
                res.status(500).json("{\"error\":\"DB error\"}");
            }
        });

        // ------------------------------------------------------------
        // REMOVE FROM CART (FIXED FOR JSON BODY)
        // ------------------------------------------------------------
        app.delete("/cart/remove", auth, (req, res) -> {

            String product = null;

            // Try form body
            Map<String, String> form = parseForm(req.body);
            product = form.get("product");

            // Fallback for JSON body
            if (product == null && req.body != null && req.body.contains("product")) {
                product = req.body
                        .replace("{", "")
                        .replace("}", "")
                        .replace("\"", "")
                        .split(":")[1];
            }

            if (product == null || product.isEmpty()) {
                res.status(400).json("{\"error\":\"Missing product\"}");
                return;
            }

            try (Connection conn = DBPool.getConnection()) {

                int userId = getUserId(conn, req.user);

                PreparedStatement stmt = conn.prepareStatement(
                        "DELETE FROM cart WHERE user_id=? AND product=? LIMIT 1");
                stmt.setInt(1, userId);
                stmt.setString(2, product);

                int rows = stmt.executeUpdate();

                if (rows > 0) {
                    res.json("{\"status\":\"success\"}");
                } else {
                    res.status(404).json("{\"error\":\"Product not found\"}");
                }

            } catch (Exception e) {
                res.status(500).json("{\"error\":\"DB error\"}");
            }
        });

        // ------------------------------------------------------------
        // START SERVER
        // ------------------------------------------------------------
        app.start(8080);
    }

    // ------------------------------------------------------------
    // HELPERS
    // ------------------------------------------------------------
    private static int getUserId(Connection conn, String username) throws Exception {
        PreparedStatement stmt = conn.prepareStatement(
                "SELECT id FROM users WHERE username=?");
        stmt.setString(1, username);
        ResultSet rs = stmt.executeQuery();
        rs.next();
        return rs.getInt("id");
    }

    private static String generateToken() {
        byte[] bytes = new byte[24];
        new SecureRandom().nextBytes(bytes);
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) sb.append(String.format("%02x", b));
        return sb.toString();
    }

    private static Map<String, String> parseForm(String body) {
        Map<String, String> map = new HashMap<>();
        if (body == null || body.isEmpty()) return map;
        String[] pairs = body.split("&");
        for (String p : pairs) {
            String[] kv = p.split("=", 2);
            if (kv.length == 2) map.put(kv[0], kv[1]);
        }
        return map;
    }

    private static String hash(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] bytes = digest.digest(password.getBytes("UTF-8"));
            StringBuilder sb = new StringBuilder();
            for (byte b : bytes) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            return password;
        }
    }
}
