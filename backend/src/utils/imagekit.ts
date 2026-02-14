import ImageKit from "imagekit";

const imageKit = new ImageKit({
    privateKey: process.env.IK_PUBLIC_KEY!,
    publicKey: process.env.IK_PRIVATE_KEY!,
    urlEndpoint: process.env.IK_URL!
});

export const uploadtoIK = async (file: Buffer, fileName: string) => {
    try {
        if (!file || !fileName) return null;

        const res = await imageKit.upload({
            file,
            fileName,
            folder: "Restaurants"
        });

        return res
    } catch (error) {
        console.log("Error while uploading image", error);
        throw new Error("Failed to upload image");
    }
}