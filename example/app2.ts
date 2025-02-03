import express, { Request, Response } from "express";
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { randomUUID } from "crypto";
import path from "path";

dotenv.config();

const app2 = express();

// Initialize AWS S3 Client (V3)
const s3 = new S3Client({
	region: process.env.AWS_REGION!,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
	},
	endpoint: process.env.AWS_S3_ENDPOINT!
});

// Multer Storage Configuration (Local Memory Storage before upload)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// @ts-ignore
app2.post("/api/v1/upload", upload.single("file"), async (req: Request, res: Response) => {
	if (!req.file) {
		return res.status(400).json({ error: "Please upload a file" });
	}

	try {
		const fileExt = path.extname(req.file.originalname);
		const fileKey = `uploads/${randomUUID()}${fileExt}`;

		// Upload to S3
		const command = new PutObjectCommand({
			Bucket: process.env.AWS_BUCKET_NAME!,
			Key: fileKey,
			Body: req.file.buffer,
			ContentType: req.file.mimetype,
			ACL: "public-read",
		});

		await s3.send(command);

		const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
		res.json({ message: "File uploaded successfully", fileUrl });
	} catch (error) {
		console.error("Upload Error:", error);
		res.status(500).json({ error: "File upload failed" });
	}
});

// Start Server
const PORT = process.env.PORT || 3100;
app2.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
