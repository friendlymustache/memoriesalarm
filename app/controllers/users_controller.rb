class UsersController < ApplicationController
  # GET /users
  # GET /users.json
  def index
    @users = User.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @users }
    end
  end

  # GET /users/1
  # GET /users/1.json
  def show
    @user = User.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @user }
    end
  end

  # GET /users/new
  # GET /users/new.json
  def new
    @user = User.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @user }
    end
  end

  # GET /users/1/edit
  def edit
    @user = User.find(params[:id])
  end

  # POST /users
  # POST /users.json
  def create
    @user = User.new({:email => params[:user][:email], :name => params[:user][:name]})
    password_hash = params[:user][:password]
    
    if password_hash.length < 6
      # puts(password_hash.to_s.length.to_s+"-----------------------------------------------------------------------------------------------")
      @password_error = true
      respond_to do |format|
        format.html {return redirect_to root_path, notice: "Make sure your password is at least 6 characters long"}
        return format.js 
      end
    end
    
    @user.password_hash = User.password_create(password_hash)

    
    respond_to do |format|
      if @user.save
        session[:user_id] = @user.id
        format.html { redirect_to root_path }
        format.js  
        format.json { render json: @user, status: :created, location: @user }
      else
        @email_error = true        
        format.html {redirect_to root_path, notice: "Please enter a valid email and make sure your password is at least 6 characters long" }
        format.js 
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /users/1
  # PUT /users/1.json
  def update
    @user = User.find(params[:id])

    respond_to do |format|
      if @user.update_attributes(params[:user])
        format.html { redirect_to @user, notice: 'User was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    @user = User.find(params[:id])
    @user.destroy

    respond_to do |format|
      format.html { redirect_to users_url }
      format.json { head :no_content }
    end
  end
end
