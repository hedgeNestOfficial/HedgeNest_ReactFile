import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "../../Style/Signup.css";
import Signupimg from "../../assets/Signupimg.jpg";
import { inputTex } from "../../JS/signupCard";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import { FcGoogle } from "react-icons/fc";
import { LuArrowLeft } from "react-icons/lu";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { ENDPOINTS } from "../../Config/apiConfig";
import { signup } from "../../Store/UserSlice";

const SignupPage = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(signupSchema),

    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      terms: false,
    },
  });

  return (
    <section className="signup-section">
      <div className="image-container">
        <img src={Signupimg} alt="HedgeNest Protection Illustration" />
      </div>

      <div className="form-container">
        <img src="" alt="" />
      </div>
    </section>
  );
};

export default SplashScreen;
