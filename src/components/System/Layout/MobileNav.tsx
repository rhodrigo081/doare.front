import Navbar from "./Navbar";
import LogoutButton from "@/components/LogoutButton";

// Importa a logo do assets
import logo from "@/assets/22ae72c2-d56e-4002-9acf-fe41d79a1f45-removebg-preview.png";

const MobileNav = () => {
  return (
    <>
      <header className="fixed inset-x-0 top-0 h-20 py-3 px-5 flex justify-between lg:hidden items-center shadow-md bg-white z-50">
        <img
          className="h-12 w-auto object-contain" // tamanho ajustado para mobile
          src={logo}
          alt="Doa.re Logo"
        />
        <LogoutButton />
      </header>

      <div className="min-h-20 lg:hidden" />

      <div className="lg:hidden fixed bottom-5 left-1/2 -translate-x-1/2 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-full px-4 bg-white z-50">
        <Navbar />
      </div>
    </>
  );
};

export default MobileNav;
