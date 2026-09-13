import Link from "next/link";
import Logo from "@/assets/svg/Logo";
import DoctorApplyForm from "@/components/form/doctor-apply-form";

export default function ApplyPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-3">
      <div className="flex flex-col col-span-2 gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <Logo />
            <span>PH Healthcare</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xl">
            <DoctorApplyForm />
          </div>
        </div>
      </div>

      <div className="relative hidden bg-muted lg:block">
        <img
          src="/login.jpg"
          alt="login"
          className="absolute inset-0 h-full w-full object-cover dard:brightness-[0.2] dark:grayscale"
        ></img>
      </div>
    </div>
  );
}
