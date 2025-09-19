import { defineEventHandler } from 'h3'
import dayjs from 'dayjs'
import supabase from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const { slug } = event.context.params

  const now = dayjs().toISOString()

  const { data, error } = await supabase
    .from('travel_dates')
    .select(`
      *,
      booked_dates (
        id,
        booked_places,
        travel_date_id
      )
    `)
    .eq('travel_slug', slug)
    .gt('departure_date', now)
    .eq('published', true)

  if (error) {
    console.error('Supabase query error:', error)
    return { error }
  }

  const processedData = data.map((item) => {
    const { booked_dates, ...rest } = item
    console.log('booked dates ====>', booked_dates)
    let nbInterestedBy = booked_dates.reduce((sum, bookedDate) => {
      console.log('booked date ===> ', bookedDate)
      if (bookedDate.booked_places === 0 && !bookedDate.deleted) {
        return sum + 1
      }
      else {
        return sum + bookedDate.booked_places
      }
    }, 0)

    if (item.custom_display) {
      nbInterestedBy += item.displayed_booked_seat
    }
    return {
      ...rest,
      nbInterestedBy,
    }
  })
  return processedData
})

// import { defineEventHandler } from 'h3'
// import supabase from '~/server/utils/supabase'

// export default defineEventHandler(async (event) => {
//   const { slug } = event.context.params

//   console.log('SUPABASE SLUG: ', slug)

//   const { data, error } = await supabase
//     .from('travel_dates')
//     .select('*')
//     .eq('travel_slug', slug)

//   console.log('SUPABASE RETURN: ', data, ' -- error: ', error)
//   if (error) return { error: error.message }
//   return data
// })
