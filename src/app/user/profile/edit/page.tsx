import InfoSection from "./Info";
import PasswordSection from "./Password";

export default function EditProfile() {
  return (
    <div className="flex flex-col md:flex-row bg-white sm:bg-light pt-16 sm:pt-20">
      <InfoSection />
      <PasswordSection />
    </div>
  )
}
