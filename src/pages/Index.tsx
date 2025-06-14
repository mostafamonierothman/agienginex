
// Redirect immediately to chat page; no landing/demo page

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/agi-chat", { replace: true });
  }, [navigate]);
  return null;
}
