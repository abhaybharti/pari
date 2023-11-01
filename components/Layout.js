import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Menu, Transition } from "@headlessui/react";
import "react-toastify/dist/ReactToastify.css";
import { Store } from "../utils/Store";
import DropdownLink from "./DropdownLink";
import { useRouter } from "next/router";
import {
  SearchIcon,
  UserIcon,
  ShoppingCartIcon,
} from "@heroicons/react/outline";

export default function Layout({ title, children }) {
  const { status, data: session } = useSession();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const logoutClickHandler = () => {
    Cookies.remove("cart");
    dispatch({ type: "CART_RESET" });
    signOut({ callbackUrl: "/login" });
  };

  const [query, setQuery] = useState("");

  const router = useRouter();
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  return (
    <>
      <Head>
        <title>{title ? title + " - Pari" : "Pari"}</title>
      </Head>

      <ToastContainer position="bottom-center" limit={1} />

      <div className="flex min-h-screen flex-col justify-between">
        <header>
          <nav className="bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex h-12">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Link href="/">
                      <a>
                        <img
                          className="h-8 w-8"
                          src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                          alt="Workflow"
                        />
                      </a>
                    </Link>
                  </div>
                  <div className="hidden md:block text-lg">
                    <div className="ml-10 flex items-baseline space-x-4">
                      <a
                        href="#"
                        className=" hover:bg-yellow-400 hover:border-2 hover:border-indigo-600 hover:font-bold text-white px-2 py-1 rounded-md font-medium"
                      >
                        Dashboard
                      </a>

                      <a
                        href="#"
                        className="hover:bg-yellow-400 hover:border-2 hover:border-indigo-600 hover:font-bold text-white px-2 py-1 rounded-md  font-medium"
                      >
                        Team
                      </a>

                      <a
                        href="#"
                        className="hover:bg-yellow-400 hover:border-2 hover:border-indigo-600 hover:font-bold text-white px-2 py-1 rounded-md font-medium"
                      >
                        Projects
                      </a>

                      <a
                        href="#"
                        className="hover:bg-yellow-400 hover:border-2 hover:border-indigo-600 hover:font-bold text-white px-2 py-1 rounded-md font-medium"
                      >
                        Calendar
                      </a>

                      <a
                        href="#"
                        className="hover:bg-yellow-400 hover:border-2 hover:border-indigo-600 hover:font-bold text-white px-2 py-1 rounded-md  font-medium"
                      >
                        Reports
                      </a>
                    </div>
                  </div>
                  <div className="mx-10 hidden md:block text-lg">
                    <form
                      onSubmit={submitHandler}
                      className="mx-auto  w-full justify-center md:flex"
                    >
                      <input
                        onChange={(e) => setQuery(e.target.value)}
                        type="text"
                        className="rounded-tr-none rounded-br-none p-1 text-sm   focus:ring-0"
                        placeholder="Search products"
                        size="40"
                      />
                      <button
                        className="rounded rounded-tl-none rounded-bl-none bg-amber-300 p-1 text-sm dark:text-black"
                        type="submit"
                        id="button-addon2"
                      >
                        <SearchIcon className="h-5 w-5"></SearchIcon>
                      </button>
                    </form>
                  </div>

                  <div className="flex gap-1">
                    <div className="flex items-center text-white hover:bg-yellow-400 hover:rounded-md text-lg hover:font-medium hover:text-indigo-600">
                      <ShoppingCartIcon className="h-5 w-5"></ShoppingCartIcon>
                      <Link
                        href="/cart"
                        className="text-white gap-1 font-medium"
                      >
                        <a className="text-white hover:bg-yellow-400 hover:rounded-md text-lg hover:font-medium hover:text-indigo-600 text-lg font-medium">
                          Cart
                          {cartItemsCount > 0 && (
                            <span className=" rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                              {cartItemsCount}
                            </span>
                          )}
                        </a>
                      </Link>
                    </div>
                    <div className="flex items-center text-white m-3 text-lg hover:bg-yellow-400 hover:rounded-md hover:border-2 hover:border-indigo-600 hover:text-indigo-600">
                      {status === "loading" ? (
                        "Loading"
                      ) : session?.user ? (
                        <Menu as="div" className="relative inline-block">
                          <Menu.Button className="text-white flex items-center gap-1 font-medium text-lg p-1 mr-1 ml-1 hover:text-indigo-600">
                            <UserIcon className="h-5 w-5"></UserIcon>
                            {session.user.name}
                          </Menu.Button>
                          <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white shadow-lg z-10 ">
                            <Menu.Item>
                              <DropdownLink
                                className="dropdown-link"
                                href="/profile"
                              >
                                Profile
                              </DropdownLink>
                            </Menu.Item>
                            <Menu.Item>
                              <DropdownLink
                                className="dropdown-link"
                                href="/order-history"
                              >
                                Order History
                              </DropdownLink>
                            </Menu.Item>
                            {session.user.isAdmin && (
                              <Menu.Item>
                                <DropdownLink
                                  className="dropdown-link"
                                  href="/admin/dashboard"
                                >
                                  Admin Dashboard
                                </DropdownLink>
                              </Menu.Item>
                            )}
                            <Menu.Item>
                              <a
                                className="dropdown-link"
                                href="#"
                                onClick={logoutClickHandler}
                              >
                                Logout
                              </a>
                            </Menu.Item>
                          </Menu.Items>
                        </Menu>
                      ) : (
                        <Link href="/login" className="text-white">
                          <a className="p-2 text-white text-lg font-medium">
                            Login
                          </a>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    type="button"
                    className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                    aria-controls="mobile-menu"
                    aria-expanded="false"
                  >
                    <span className="sr-only">Open main menu</span>
                    {!isOpen ? (
                      <svg
                        className="block h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="block h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Transition
              show={isOpen}
              enter="transition ease-out duration-100 transform"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-75 transform"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {(ref) => (
                <div className="md:hidden" id="mobile-menu">
                  <div ref={ref} className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <a
                      href="#"
                      className="hover:bg-yellow-400 hover:border-indigo-600  text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Dashboard1
                    </a>

                    <a
                      href="#"
                      className="hover:bg-yellow-400 hover:border-indigo-600  text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Team
                    </a>

                    <a
                      href="#"
                      className="hover:bg-yellow-400 hover:border-indigo-600 text-white  block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Projects
                    </a>

                    <a
                      href="#"
                      className="hover:bg-yellow-400 hover:border-indigo-600  text-white  block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Calendar
                    </a>

                    <a
                      href="#"
                      className="hover:bg-yellow-400 hover:border-indigo-600 text-white  block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Reports
                    </a>
                  </div>
                </div>
              )}
            </Transition>
          </nav>
        </header>
        <main className="container m-auto mt-4 px-4">{children}</main>
        <footer className="flex h-10 justify-center items-center shadow-inner">
          <p>Copyright © 2022 Amazona</p>
        </footer>
      </div>
    </>
  );
}
