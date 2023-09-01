import { pool } from "../utils/connectToDb";

export async function giveStarRating( fromLawyerId: number, toLawyerId: number, rating: number ): Promise<string | void> {

    // Get the current star rating and rating num of the target lawyer from the database
    const result = await pool.query(
        "SELECT star_rating, rating_num FROM lawyer_profiles WHERE lawyer_id = $1",
        [toLawyerId]
    );
      
    if (result.rows.length === 0) {
        return "Target lawyer not found.";
    }
        
    const currentStarRating = result.rows[0].star_rating;
    const currentRatingNum = result.rows[0].rating_num;

    //checking whether the rating between the 2 lawyers has already been made
    const exist = await pool.query(
        "SELECT rating FROM star_ratings WHERE from_lawyer_id = $1 AND to_lawyer_id = $2",
        [fromLawyerId, toLawyerId]
      );
    
    if (exist.rows.length > 0) {
        const existingRating = exist.rows[0].rating;
        await updateRating(currentStarRating, existingRating, rating, currentRatingNum, toLawyerId, fromLawyerId);
        return;
    }
  
    // Calculate the new total star rating and number of ratings for the target lawyer
    const newTotalStarRating = currentStarRating * currentRatingNum + rating;
    const newRatingNum = currentRatingNum + 1;
    const newAverageRating = newTotalStarRating / newRatingNum;

    // Insert the star rating into the star_rating table
    await pool.query("INSERT INTO star_ratings (from_lawyer_id, to_lawyer_id, rating) VALUES ($1, $2, $3)", 
    [ fromLawyerId, toLawyerId, rating ]);

    // Update the target lawyer's star_rating and rating_num in the database
    await pool.query(
      "UPDATE lawyer_profiles SET star_rating = $1, rating_num = $2 WHERE lawyer_id = $3",
      [newAverageRating, newRatingNum, toLawyerId]
    );
  }

  // For updating a previously given rating
  export async function updateRating(starRating: number, oldRating: number, newRating: number, ratingNum: number, toLawyerId: number, fromLawyerId: number){
        const totalRating = starRating * ratingNum - oldRating + newRating;
        const newAverageRating = totalRating / ratingNum;
        await pool.query(
            "UPDATE lawyer_profiles SET star_rating = $1 WHERE lawyer_id = $2",
            [newAverageRating, toLawyerId]
          );
        await pool.query(
            "UPDATE star_ratings SET rating = $1 WHERE from_lawyer_id = $2 AND to_lawyer_id = $3",
            [newRating, fromLawyerId, toLawyerId]
        )
  }
