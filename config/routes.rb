Rails.application.routes.draw do
  root 'static_pages#home'
  post '/search', to: 'static_pages#search'
end
