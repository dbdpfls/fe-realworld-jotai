"use client";
import { authState } from "@/jotai/auth/atom";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

export default function Header() {
  const [auth] = useAtom(authState);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <a className="navbar-brand" href="/">
          conduit
        </a>
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <a className="nav-link active" href="/">
              Home
            </a>
          </li>
          {auth.isAuthenticated ? (
            <>
              <li className="nav-item">
                <a className="nav-link" href="/editor">
                  <i className="ion-compose"></i>&nbsp;New Article
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/settings">
                  <i className="ion-gear-a"></i>&nbsp;Settings
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href={`/profile/${auth.user.username}`}>
                  <img
                    src={auth.user.image || "/image/user.png"}
                    className="user-pic"
                  />
                  {auth.user.username}
                </a>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <a className="nav-link" href="/login">
                  Sign in
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/register">
                  Sign up
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
