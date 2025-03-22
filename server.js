const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Multer setup for handling file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to serve the index.html file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route to handle image conversion
app.post("/convert", upload.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    try {
        const avifBuffer = await sharp(req.file.buffer)
            .avif({ quality: 50 })
            .toBuffer();

        res.setHeader("Content-Disposition", 'attachment; filename="converted.avif"');
        res.setHeader("Content-Type", "image/avif");
        res.send(avifBuffer);
    } catch (error) {
        console.error("Conversion Error:", error);
        res.status(500).send("Error converting image.");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
