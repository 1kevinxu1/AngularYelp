class StaticPagesController < ApplicationController
  def home
    render :index
  end

  def search
    # debugger
    result = Yelp.client.search(params['location'], {term: params['topic']})
    render json: result.businesses
    # render json: result.businesses.map{|business| business.name}
  end
end
