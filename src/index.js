import axios from 'axios';
import Notiflix, { Notify } from 'notiflix';
import simplelightbox from 'simplelightbox';
import Handlebars from 'handlebars';
import 'simplelightbox/dist/simple-lightbox.min.css';
import sample from './sample'
let page = 1;
const API_KEY = '24498675-6793d83b551f1f48f912e83a8';
const BASE_URL = 'https://pixabay.com/api/';
const refs = {
    inputEl: document.querySelector('input'),
    searchBtn: document.querySelector('.submit-btn'),
    formEl: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more')
}
refs.loadMoreBtn.classList.add('is-hidden')
refs.formEl.addEventListener('submit', onSubmitBtnClick);
refs.loadMoreBtn.addEventListener('click', loadMore);



async function onSubmitBtnClick(event) {
    try {
        page = 1;
        event.preventDefault();
        refs.loadMoreBtn.classList.add('is-hidden')
        const q = event.target.searchQuery.value.trim();
        clearGallery();
        if (q !== '') {
            console.log(q)
            const { data } = await fetchImages(q);
                refs.gallery.insertAdjacentHTML('beforeend', sample(data.hits));
            
            
                if (data.total > 0) {
                    Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`)
                    showLoadBtn();

                } else {
                    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
                }
            
        }}
            catch {
            (err) 
                console.log(err);
        }
    
};



const fetchImages = q => {
  return axios.get(`${BASE_URL}`, {
    params: {
      key: API_KEY,
      q,
      page,
      per_page: 40,
    },
  });
};

function clearGallery() {
    refs.gallery.innerHTML = '';
}

function showLoadBtn() {
    refs.loadMoreBtn.classList.remove('is-hidden');
}
async function loadMore(event) {
    try{
    page += 1;
    const q = refs.inputEl.value.trim();
        const { data } = await fetchImages(q);
        refs.gallery.insertAdjacentHTML('beforeend', sample(data.hits));
        if (data.total > 0 && data.hits.length >= 1 ) {
                showLoadBtn();
                Notiflix.Notify.success(`Success! ${data.hits.length} more images loaded!`)
        } if (data.hits.length === 0) {
            refs.loadMoreBtn.classList.add('is-hidden');
                Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
            } 

          }
    catch {
            (err) 
                console.log(err);
        }
}

