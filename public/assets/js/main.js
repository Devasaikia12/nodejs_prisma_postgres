const base_url = document.getElementById('base_url').value
const dirname = document.getElementById('dirname').value
document.querySelector('.getPostModal').addEventListener('click', function () {
  const id = this.dataset.id
  console.log(id)
  axios
    .get(`${base_url}/posts/getPost/${id}`)
    .then(function ({ data }) {
      console.log(data)
      document.querySelector('.card-img-top').src =
        '../../uploads/' + data.image_name
      document.querySelector('.card-title').innerHTML = data.title
      document.querySelector('.card-text').innerHTML = data.body
    })
    .catch(function (error) {
      console.log(error)
    })
})
