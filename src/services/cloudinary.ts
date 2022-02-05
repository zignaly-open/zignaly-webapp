import { Cloudinary } from "@cloudinary/url-gen";

interface CloudinaryOptions {
  folder: string;
  id: string;
}

// Create a Cloudinary instance and set your cloud name.
const cloudinary = ({ folder, id }: CloudinaryOptions) => {
  // return new Cloudinary({
  //   cloud: {
  //     cloudName: "zignaly",
  //   },
  // });
  return `https://res.cloudinary.com/zignaly/image/upload/${folder}/${id}`;
};

export default cloudinary;
