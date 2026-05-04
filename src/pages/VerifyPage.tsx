import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CodeVerify from "../components/Verification/CodeVerify";
import { supabase } from "../lib/supabase";

const VerifyPage: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const email = state?.email || "E-posta bulunamadı";

  const handleConfirm = async (code: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "signup",
      });

      if (error) throw error;

      await supabase.functions.invoke("welcome-email", {
        body: { email, fullName: state?.fullName || "Yeni Üye" },
      });

      navigate("/account");
    } catch (err) {
      alert("Hatalı kod girdiniz!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <CodeVerify
        target={email}
        isLoading={loading}
        onConfirm={handleConfirm}
        onBack={() => navigate("/register")}
      />
    </div>
  );
};

export default VerifyPage;
