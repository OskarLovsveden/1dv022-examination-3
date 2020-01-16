/**
 * Shuffles the provided array.
 *
 * @param {Array} array - The array to be shuffled
 * @returns a shuffled array
 */
function fisherYatesShuffle (array) {
  let m = array.length

  while (m) {
    const i = Math.floor(Math.random() * m--)

    const t = array[m]
    array[m] = array[i]
    array[i] = t
  }

  return array
}

/**
 * Lets you provide a function to handle the data from the server.
 *
 * @param {Number} number - The number to get the fact of
 * @param {Function} handleData - The function that will handle the data
 * @returns a promise from the server
 */
async function getFact (number, handleData) {
  const topics = ['trivia', 'math', 'date', 'year']
  const randomIndex = Math.floor((Math.random() * 4) + 1) - 1
  const category = topics[randomIndex]

  const response = await window.fetch(`http://numbersapi.com/${number}/${category}?json`)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
    .then((data) => {
      handleData(data)
    }).catch((error) => {
      console.error('There has been a problem with your fetch operation:', error)
    })
}

export { fisherYatesShuffle, getFact }
