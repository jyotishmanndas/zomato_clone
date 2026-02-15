import ImageKit from "imagekit";

const imageKit = new ImageKit({
    privateKey: process.env.IK_PRIVATE_KEY!,
    publicKey: process.env.IK_PUBLIC_KEY!,
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
};

export const deleteFromIk = async (fileId: string[]) => {
    try {
        if (!fileId) return;

        await imageKit.bulkDeleteFiles(fileId)
    } catch (error) {
        console.error("Image delete failed", error);
        throw new Error("Failed to delete image");
    }
}