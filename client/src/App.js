import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./App.css";
import ArticleDetailPage from "./pages/articleDetail/ArticleDetailPage";
import HomePage from "./pages/home/HomePage";
import RegisterPage from "./pages/register/RegisterPage";
import LoginPage from "./pages/login/LoginPage";
import ProfileeditPage from "./pages/profileedit/ProfileEditPage";
import Contact from "./pages/contact/contact";
import NotFoundPage from "./pages/Notfound/notfound";
import Adminpage from './pages/adminPage/adminpage';
import Profile from "./pages/ProfilePage/ProfilePage"; 
import FeedPage from "./pages/FeedPage/FeedPage";
import Createcollection from "./pages/Createcollection/Createcollection";
import Editcollection from "./pages/Editcollection/Editcollection"; 
import About from "./pages/About/AboutPage"; 
function App() {
  return (
    <div className="App font-opensans">
      <Routes>
        <Route index path="/" element={<HomePage />} />
        <Route path="/blog/:slug" element={<ArticleDetailPage />} />
        <Route path="/articles" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profileedit" element={<ProfileeditPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Adminpage />} /> 
        <Route path="profile" element={<Profile />} /> 
        <Route path="feed" element={<FeedPage />} />
        <Route path="createcollection" element={<Createcollection/>} /> 
        <Route path="editcollection" element={<Editcollection/>} /> 
        <Route path="about" element={<About/>} /> 
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
