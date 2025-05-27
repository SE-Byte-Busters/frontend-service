import ProfileForm from './ProfileForm';

type InfoSectionProps = {
  userData: {
    username: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

export default function InfoSection({ userData }: InfoSectionProps) {
  const formInitialValues = {
    username: userData.username || '',
    phone: userData.phoneNumber || '',
    first_name: userData.firstName || '',
    last_name: userData.lastName || '',
    email: userData.email || '',
    photo: "",
  };

  return (
    <section className="bg-light rounded-2xl shadow-md p-6" dir="rtl">
      <h1 className="text-xl font-bold text-dark mb-4">
        مشخصات پروفایل کاربری من
      </h1>
      <ProfileForm initialProfile={formInitialValues} />
    </section>
  );
}