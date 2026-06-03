import { useState } from "react";
import { useNavigate } from "react-router-dom";

const [activetab, setActiveTab] = useState(null);
const navigate = useNavigate();

const shieldClick = () => {
  setActiveTab("shield");
  navigate("/shield");
};
