import ProfileForm from './ProfileForm';

export default function InfoSection() {
  // TODO: replace with API call
  const user = {
    username: "Ali_rezaei22",
    phone: "09124325465",
    first_name: "علی",
    last_name: "رضایی",
    email: "AliRezaei1382@gmail.com",
    photo: "",
  };

  return (
    <section className="bg-light rounded-2xl shadow-md p-6">
      <h1 className="text-xl font-bold text-dark">
        مشخصات پروفایل کاربری من
      </h1>
      <ProfileForm initialProfile={user} />
    </section>
  );
}
