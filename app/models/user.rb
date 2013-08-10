require 'bcrypt'

class User < ActiveRecord::Base
  include BCrypt
  attr_accessible :name, :password_hash_confirmation, :group_id, :password_hash, :email
  has_and_belongs_to_many :groups, :uniq => true   
  has_many :contents
   
   
  #BCRYPT STUFF STARTS HERE
  
  def password # This is what is called whenever @user.password is referenced. Returns a Password object from the data in a stored encrypted hash
    if password_hash != nil
     @password ||= Password.new(password_hash)
    else
      return false
    end
  end

  def password_create(new_password) #params[:password] should be passed into this in a secure fashion
      @password = Password.create(new_password)
      password_hash = @password
  end



 def self.login(email, password)  #shouldn't be any params
    @user = User.find_by_email(email) # parameter here should be params[:email]
    if @user == nil || @user.password != password
      return false
    else
      return @user 
    end
 end
  
 def self.password_create(new_password)
  @password = Password.create(new_password)
  password_hash = @password
 end
 

    
end
