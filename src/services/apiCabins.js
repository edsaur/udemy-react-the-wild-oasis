import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins couldn't be loaded");
  }

  return data;
}

export async function getCabinCapacity(id) {
  const { data, error } = await supabase
    .from("cabins")
    .select("id, capacity")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Cabins couldn't be loaded");
  }

  return data;
}

export async function getCabinPrice(id) {
  const { data, error } = await supabase
    .from("cabins")
    .select("id, regularPrice, discount")
    .eq("id", id)
    .single();
  if (error) {
    console.error(error);
    throw new Error("Cabins couldn't be loaded");
  }

  return data;
}

export async function createAndEditCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
  console.log(hasImagePath);

  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    ""
  );

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  console.log(newCabin.image);
  console.log(imagePath);
  console.log(imageName);

  // 1. Create and editing cabin and insert image
  let query = supabase.from("cabins");
  let previousImagePath = null;

  if (id) {
    const { data: cabinData, error: fetchError } = await query
      .select("image")
      .eq("id", id)
      .single(); // This is to fetch the current cabin data if editing

    if (fetchError) {
      throw new Error("There's an error fetching the cabin data");
    }

    previousImagePath = cabinData.image;

    console.log(previousImagePath);
  }

  console.log(imagePath);

  // A. CREATING a CABIn
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);
  else query = query.update({ ...newCabin, image: imagePath }).eq("id", id);

  const { data, error } = await query.select().single();
  console.log(imagePath);

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be created/edited!");
  }

  // 2. This will upload the image to storage bucket of supabase.

  if (!hasImagePath) {
    const { error: storageError } = await supabase.storage
      .from("cabin-images")
      .upload(imageName, newCabin.image, {
        cacheControl: "3600",
        upsert: false,
      });

    if (storageError) {
      if (!id) await supabase.from("cabins").delete().eq("id", data.id);
      throw new Error(
        "Cabin image could not be uploaded and the cabin was not created"
      );
    }
  }

  // Delete photo from storage if new image has been uploaded

  if (id && previousImagePath && previousImagePath !== imagePath) {
    const previousImageName = previousImagePath.split("/").pop();

    const { error: removeError } = await supabase.storage
      .from("cabin-images")
      .remove([previousImageName]);

    if (removeError) {
      console.error("Error deleting previous image:", removeError);
      throw new Error("There is an error in deleting the image");
    }
  }

  return data;
}

export default async function deleteCabin({ cabinImage, cabinId }) {
  const currentImagePath = cabinImage.split("/").pop();

  const { data: duplicates, error: duplicateError } = await supabase
    .from("cabins")
    .select("id")
    .eq("image", cabinImage);

  if (duplicateError) {
    throw new Error("There is an error in checking the duplicate images");
  }

  if (duplicates.length <= 1) {
    const { error: imageDeletionError } = await supabase.storage
      .from("cabin-images")
      .remove([currentImagePath]);
    if (imageDeletionError) {
      console.error(imageDeletionError + " the error is at imageDeletion.");
      throw new Error("Cabin image could not be deleted!");
    }
  }

  const { data, error: dataDeletionError } = await supabase
    .from("cabins")
    .delete()
    .eq("id", cabinId);

  if (dataDeletionError) {
    console.error(dataDeletionError + " the error is at data deletion");
    throw new Error("Cabin could not be deleted!");
  }

  return data;
}
