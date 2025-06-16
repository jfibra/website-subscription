import Link from "next/link"

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: "3rem", fontWeight: "bold", color: "#2563EB" }}>404</h1>
      <h2 style={{ fontSize: "1.5rem", marginTop: "0.5rem", marginBottom: "1rem" }}>Page Not Found</h2>
      <p style={{ marginBottom: "2rem", color: "#4B5563" }}>Sorry, we couldn't find the page you're looking for.</p>
      <Link
        href="/"
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#2563EB",
          color: "white",
          textDecoration: "none",
          borderRadius: "0.375rem",
        }}
      >
        Go Home
      </Link>
    </div>
  )
}
