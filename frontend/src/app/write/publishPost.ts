

// const publishPost = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setPublishing(true);

//   const token = localStorage.getItem("token");
//   if (!token) {
//     alert("You must be logged in to publish a post!");
//     router.push("/sign-in");
//     return;
//   }
//   const apiUrl = process.env.API_URL || "http://127.0.0.1:5000";
//   // const apiUrl = process.env.API_URL || "http://localhost:5000";

//   // 1. Create FormData
//   const formData = new FormData();
//   formData.append("title", publish.title);
//   formData.append("content", publish.content);
//   formData.append("category", publish.category);
//   formData.append("author", publish.author);

//   let finalImageUrl = publish.img_url;

//   if (imageFile) {
//     try {
//       // Create a new FormData just for Cloudinary
//       const cloudFormData = new FormData();
//       cloudFormData.append("file", imageFile);
//       cloudFormData.append("upload_preset", "ml_default"); // <-- PUT YOUR PRESET NAME HERE

//       const cloudRes = await fetch(
//         `https://api.cloudinary.com/v1_1/dmr4gb8mj/image/upload`, // <-- PUT YOUR CLOUD NAME HERE
//         {
//           method: "POST",
//           body: cloudFormData,
//         }
//       );

//       const cloudData = await cloudRes.json();
//       if (cloudData.secure_url) {
//         finalImageUrl = cloudData.secure_url; // Get the public URL from Cloudinary
//       } else {
//         throw new Error("Cloudinary upload failed");
//       }
//     } catch (err: any) {
//       console.error("Error uploading to Cloudinary:", err.message);
//       setPublishing(false);
//       return; // Stop if image upload fails
//     }
//   }

//   // 2. --- SEND THE FINAL URL TO YOUR BACKEND ---
//   try {
//     // Now your backend just receives JSON, not FormData
//     const response = await fetch(`${apiUrl}/posts`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json", // <-- CHANGE THIS BACK TO JSON
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         title: publish.title,
//         content: publish.content,
//         author: publish.author,
//         category: publish.category,
//         img_url: finalImageUrl, // Send the Cloudinary URL or preset URL
//       }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.error || "Failed to publish post");
//     }

//     // ... (rest of your success logic)
//     router.push("/");
//   } catch (error: any) {
//     console.error("Error publishing post:", error.message);
//   } finally {
//     setPublishing(false);
//   }
// };
