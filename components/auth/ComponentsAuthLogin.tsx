'use client';
// import IconMail from '@/components/icon/icon-mail';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import IconLockDots from '../icon/IconLocksDot';
import IconUser from '../icon/IconUser';
import { signIn } from 'next-auth/react';

const ComponentsAuthLoginForm = () => {
    const router = useRouter();
    const [error, setError] = useState("");
    const submitForm = async (e: any) => {
        e.preventDefault();
        const username = e.currentTarget.Username.value;
        const password = e.currentTarget.Password.value;

        if (!username || !password) {
            setError("Username dan password tidak boleh kosong");
            return;
        }

        try {
            const res = await signIn("credentials", {
                redirect: false,
                username: username,
                password: password,
                callbackUrl: '/',
            })

            if(res?.error){
                setError("Username atau password tidak valid");
                return;
            }
            router.replace('/');
        } catch (error) {
            console.log(error)
        }
        // router.push('/');
    };

    return (
        <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
            {error && (
                <div className="flex items-center p-3.5 rounded text-danger bg-danger-light dark:bg-danger-dark-light">
                    <strong className="ltr:mr-1 rtl:ml-1">{error}</strong>
                </div>
            )}
            <div>
                <label htmlFor="Username">Username</label>
                <div className="relative text-white-dark">
                    <input id="Username" type="Username" placeholder="Masukkan Username" className="form-input ps-10 placeholder:text-white-dark" />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconUser fill={true}/>
                    </span>
                </div>
            </div>
            <div>
                <label htmlFor="Password">Password</label>
                <div className="relative text-white-dark">
                    <input id="Password" type="password" placeholder="Masukkan Password" className="form-input ps-10 placeholder:text-white-dark" />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconLockDots fill={true} />
                    </span>
                </div>
            </div>
            <button type="submit" className="btn btn-gradient !mt-8 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                Login
            </button>
        </form>
    );
};

export default ComponentsAuthLoginForm;
