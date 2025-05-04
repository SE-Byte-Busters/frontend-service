import InfoSection from "@/components/profile/Info";
import PasswordSection from "@/components/profile/Password";

export default function EditProfile() {
  return (
    <div className="min-h-screen bg-gray-100 pt-20 py-8 px-4 sm:px-8 lg:px-20">
      {/* amirhossein : iam add mt */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-20 items-start mt-40">
        <InfoSection />
        <PasswordSection />
      </div>
    </div>
  )
}
