import { getSupabaseBrowserClient } from "./client" // Or server client if used in server actions

const BUCKET_NAME = "websites_assets" // As defined in your SQL script

export async function uploadWebsiteAsset(
  file: File,
  userId: string,
  websiteId: string,
  assetType: "logo" | "preview_image" | "other" = "other",
): Promise<{ publicUrl: string | null; error: Error | null; path: string | null }> {
  const supabase = getSupabaseBrowserClient() // Use server client if in a server action
  const fileExt = file.name.split(".").pop()
  const fileName = `${assetType}-${Date.now()}.${fileExt}`
  const filePath = `${userId}/${websiteId}/${fileName}`

  const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file)

  if (error) {
    console.error("Error uploading file:", error)
    return { publicUrl: null, error, path: null }
  }

  const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

  return { publicUrl: urlData?.publicUrl || null, error: null, path: filePath }
}

export async function getWebsiteAssetUrl(filePath: string): Promise<string | null> {
  const supabase = getSupabaseBrowserClient()
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)
  return data?.publicUrl || null
}

export async function createSignedUrl(
  filePath: string,
  expiresInSeconds: number = 60 * 60, // 1 hour
): Promise<{ signedUrl: string | null; error: Error | null }> {
  const supabase = getSupabaseBrowserClient() // Use server client for signed URLs typically
  const { data, error } = await supabase.storage.from(BUCKET_NAME).createSignedUrl(filePath, expiresInSeconds)

  if (error) {
    console.error("Error creating signed URL:", error)
    return { signedUrl: null, error }
  }
  return { signedUrl: data?.signedURL || null, error: null }
}

// Example usage in a component (client-side upload)
// const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//   const file = event.target.files?.[0];
//   const userId = "current-user-id"; // Get from session
//   const websiteId = "current-website-id";

//   if (file && userId && websiteId) {
//     const { publicUrl, error, path } = await uploadWebsiteAsset(file, userId, websiteId, "logo");
//     if (error) {
//       alert("Upload failed: " + error.message);
//     } else if (publicUrl && path) {
//       alert("File uploaded: " + publicUrl);
//       // Save the 'path' or 'publicUrl' to your 'websites' table in the 'preview_image_url' column
//       // e.g., await supabase.from('websites').update({ preview_image_url: path }).eq('id', websiteId);
//     }
//   }
// };
