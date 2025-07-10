import ProfileHeader from "./components/ProfileHeader";
import CollegeInfo from "./components/CollegeInfo";
import { Button } from "../components/ui/button";

export default function ProfilePage() {
    return (
        <div className="container min-h-screen py-12">
            {/* Top buttons */}
            <div className="flex justify-between h-[190px] bg-primary rounded-xl items-top px-6 py-4 text-white">
                <h1 className="text-sm uppercase font-poppinsmedium text-[12px]">My Profile</h1>
                <div>
                    <Button variant={"default"}>Edit Profile</Button>
                    <Button variant={"default"}>Change Password</Button>
                </div>
            </div>

            {/* Floating White Cards Section */}
            <div className="con mx-auto mt-[-120px] grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
                {/* Left Column (1/3) */}
                <div className="space-y-4">
                    <ProfileHeader />
                </div>

                {/* Right Column (2/3) */}
                <div className="lg:col-span-2 space-y-4">
                    <CollegeInfo />
                </div>
            </div>
        </div>
    );
}
