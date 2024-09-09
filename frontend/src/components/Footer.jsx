import React from "react";

const Footer = () => {
  return (
    <div className="h-auto w-full bg-slate-950 text-white">
      {/* Main footer content */}
      <div className="grid grid-cols-3 grid-rows-1 py-8 pl-[6%]">
        <div className="pr-16">
          <p className="font-bold text-3xl tracking-tight">About Us</p>
          <br />
          <div>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minus,
            dolor non. Ex, officiis dolorum? Pariatur eos quod assumenda magnam
            voluptates! Ad a quo officia optio voluptate sint, voluptatibus
            asperiores quam dolorem laboriosam omnis iste quia porro, dolorum
            ducimus nam, aspernatur fugit nihil excepturi perspiciatis nostrum
            aliquam odit blanditiis! Inventore, assumenda!
          </div>
        </div>
        <div className="">
          <p className="font-bold text-3xl tracking-tight">Support</p>
          <br />
          <ul className="block">
            <li>FAQ</li>
            <li className="mt-2">Terms Of Service</li>
            <li className="mt-2">Privacy Policy</li>
          </ul>
        </div>
        <div>
          <p className="font-bold text-3xl tracking-tight">Contact</p>
          <br />
          <ul className="flex flex-col gap-y-1">
            <li>BMK Company Pvt Ltd</li>
            <li>Naxal, Kathmandu</li>
            <li>Nepal</li>
            <li className="flex items-center gap-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-3"
              >
                <path
                  fillRule="evenodd"
                  d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                  clipRule="evenodd"
                />
              </svg>
              Phone: +977 9801234567
            </li>
            <li className="flex items-center gap-x-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-3"
              >
                <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
              </svg>
              Email: emailnagar@gmail.com
            </li>
          </ul>
        </div>
      </div>

      {/* Company name and "All rights reserved" section */}
      <div className="w-full py-4 text-center ">
        <p>© 2024 BMK Company Pvt Ltd. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
