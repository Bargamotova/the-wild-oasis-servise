// interactive with API
import supabase, { supabaseUrl } from "./supabase";

// *GET ALL 
export async function getCabins() {
  const { data, error } = await supabase
    .from('cabins')
    .select('*')

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }
  return data;
}

//*     CREATE / EDIT / COPY
export async function createEditCabin(newCabin, id) {

  const randomNum = Math.random();

  // 1.FIND ITEM OF CABIN HAS OLD IMAGE IN CASE WILL NEEDS TO UPDATE IMAGE
  let imgOld;
  if (id) {
    const { data: oldImg } = await supabase.from('cabins').select('image',).single().eq("id", id)
    imgOld = oldImg?.image?.split('/').splice(-1).join('');
  }

  //COPY CABIN WITH IMAGE, CHANGE NAME OF IMAGE
  let imgCopy;
  let pathOfImageData;
  const copyCabin = newCabin.copy === true;
  if (copyCabin) imgCopy = newCabin?.image.split('/').splice(-1).join('');
  const newImgCopy = imgCopy?.split('-').splice(-2).join("-");

  const imgCopyWithRandomNumber = randomNum + `-${newImgCopy}`;
  if (copyCabin) {
    const { data: imgData } = await supabase
      .storage
      .from('cabin-images')
      .copy(`${imgCopy}`, `${imgCopyWithRandomNumber}`);
    pathOfImageData = imgData?.path.split('/').splice(-1).join('');
  }


  // 2. CHECK IF NEEDS TO UPDATE IMG FROM DATA
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  const imageName = `${randomNum}-${newCabin.image.name}`.replaceAll("/", "");

  const imagePathNew = hasImagePath ? newCabin?.image : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;
  const imageCopyPath = hasImagePath && `${supabaseUrl}/storage/v1/object/public/cabin-images/${pathOfImageData}`;
  const imagePath = copyCabin ? imageCopyPath : imagePathNew;

  // 3.CREATE CABIN
  let query = supabase.from('cabins');
  //A. CREATE
  if (!id) query = query.insert([{ ...newCabin, image: imagePath, copy: false }]);

  // B. EDIT
  if (id) query = query.update({ ...newCabin, image: imagePathNew, }).eq('id', id)
  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error(id ? "Cabin could not be updated" : "Cabin could not be created");
  }

  // 2. UPLOAD IMAGE
  let queryImg = supabase.storage.from('cabin-images');

  //* delete old image and upload new 
  if (!hasImagePath) queryImg = await queryImg.upload(imageName, newCabin.image);

  //* if (not imagePath and exist old img) = true   or (not ImagePath ) , delete old image 
  if (!hasImagePath && imgOld || !hasImagePath) {
    await supabase
      .storage
      .from('cabin-images')
      .remove([`${imgOld}`]);
  }

  const { error: storageError } = queryImg;

  // 3. DELETE THE CABIN IF THERE WAS AN ERROR UPLOADING IMAGE
  if (storageError) {
    await supabase
      .from('cabins')
      .delete()
      .eq('id', data.id);
    console.error(storageError);
    throw new Error("Cabin image could not be uploaded and the cabin was not be created");
  }
  console.log(data)
  return data;
}

//! DELETE CABIN WITH IMAGE FROM BUCKET
export async function deleteCabin(id) {
  const { data: oldImg } = await supabase.from('cabins').select('image').single().eq('id', id)
  let imageName = oldImg.image.split('/').splice(-1).join('');

  // 2. delete image from the bucket
  const { error: imgError } = await supabase
    .storage
    .from('cabin-images')
    .remove([`${imageName}`]);
  if (imgError) {
    console.error(imgError);
    throw new Error("Image could not be deleted");
  }
  // 3.delete cabin
  const { data, error } = await supabase
    .from('cabins')
    .delete()
    .eq('id', id);
  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted");
  }
  console.log(data)
  return null;
}

// Remove image of deleted cabin in bucket of supabase
export async function deleteImage(image) {
  const imageName = image.split('/').splice(-1).join('');
  const { error } = await supabase
    .storage
    .from('cabin-images')
    .remove([`${imageName}`]);
  if (error) {
    console.error(error);
    throw new Error("Image could not be deleted");
  }
  return null;
}
//
// if (hasImagePath) query = query.select('image');
/**
const { data: dataImg } = await supabase.storage.from('cabin-images').list()
const { data: dataStorageImg } = await supabase.from('cabins').select('image');
const bdImage = Array.from(dataImg.map(img => img.name));
const storImage = Array.from(dataStorageImg.map(img => img.image.split('/').splice(-1).join('')));
*/

