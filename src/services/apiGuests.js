import supabase from './supabase'

export async function getGuests(){
    const {data, error} = await supabase.from('guests').select('id, fullName');

    if (error) {
        console.error(error);
        throw new Error("Booking not found");
      }
      
    return data
}