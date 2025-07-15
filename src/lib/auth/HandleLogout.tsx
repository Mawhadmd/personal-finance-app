export default function handleLogout() {
  if (!confirm("Are you sure you want to log out?")) {
    return
  }
         fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        
          },
          body: JSON.stringify({}),
        }).then((response) => {
          if (response.ok) {
            window.location.href = "/login";
          } else {
            alert("Logout failed");
          }
        });
    }