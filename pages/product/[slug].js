import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import Product from "../../models/Product";
import db from "../../utils/db";
import { Store } from "../../utils/Store";

export default function ProductScreen(props) {
  const { product } = props;
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!product) {
    return <Layout title="Product Not Found">Product Not Found</Layout>;
  }

  let images = product.image.split("!") || product.image;
  let description = product.description.split("!") || product.description;
  

  const nextSlide = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error("Sorry. Product is out of stock");
    }

    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
    router.push("/cart");
  };

  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href="/">back to products</Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3 border-2">
        <div className="md:col-span-2">
          <button onClick={prevSlide} className="font-bold">
            Previous
          </button>
          <Image
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            width={640}
            height={640}
            layout="responsive"
          />
          <button onClick={nextSlide} className="font-bold">
            Next
          </button>
        </div>
        <div className="ml-1">
          <ul>
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            {/* <li>Category: {product.category}</li> */}
            <li>Brand: {product.brand}</li>
            <li>
              {product.rating} of {product.numReviews} reviews
            </li>
            <li className="font-bold mt-2">About this item: </li>
            <li>
              {" "}
              <div className="mt-4 ml-2">
                <ul className="list-disc space-y-2 pl-4 text-sm ">
                  {description.map((desc) => (
                    <li key={desc}>
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
            <li className="py-2 ml-5">
              <a
                target="blank"
                href="https://api.whatsapp.com/send?phone=+919999915562&text=Hi"
              >
                <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full flex items-center">
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.293 8.293a1 1 0 011.414 0l2 2a1 1 0 01-1.414 1.414l-2-2a1 1 0 010-1.414z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6a2 2 0 100-4 2 2 0 000 4z"
                    ></path>
                  </svg>
                  Send Inquiry on WhatsApp
                </button>
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>Price</div>
              <div>₹{product.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status</div>
              <div>{product.countInStock > 0 ? "In stock" : "Unavailable"}</div>
            </div>
            <button
              className="primary-button w-full"
              onClick={addToCartHandler}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
