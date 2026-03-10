import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { supabase } from "../../lib/supabase";
import { Loader2 } from "lucide-react";

/**
 * Auth callback page: receives redirect from Google/Supabase after OAuth login.
 * Exchanges ?code= for session (PKCE) or reads session from hash, then redirects to /shop.
 */
export function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!supabase) {
        if (!cancelled) {
          setError("Supabase is not configured.");
          setTimeout(() => navigate("/", { replace: true }), 2000);
        }
        return;
      }

      const code = searchParams.get("code");
      const hashParams = window.location.hash;

      try {
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        } else if (hashParams) {
          const { data, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) throw sessionError;
          if (!data?.session && !cancelled) {
            setError("Could not restore session from redirect.");
            setTimeout(() => navigate("/", { replace: true }), 2000);
            return;
          }
        } else {
          const { data } = await supabase.auth.getSession();
          if (data?.session && !cancelled) {
            navigate("/shop", { replace: true });
            return;
          }
          if (!cancelled) {
            setError("No auth code or session found.");
            setTimeout(() => navigate("/", { replace: true }), 2000);
          }
          return;
        }

        if (!cancelled) {
          navigate("/shop", { replace: true });
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Login failed.";
        if (!cancelled) {
          setError(message);
          setTimeout(() => navigate("/", { replace: true }), 3000);
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [navigate, searchParams]);

  if (error) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 text-sm mb-2">{error}</p>
          <p className="text-white/50 text-xs">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[40vh] flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
        <p
          className="text-white/80 text-sm tracking-wide"
          style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}
        >
          កំពុងចូលគណនី...
        </p>
        <p className="text-white/40 text-xs">Redirecting to Shop</p>
      </div>
    </div>
  );
}
