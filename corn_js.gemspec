$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "corn_js/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "corn_js"
  s.version     = CornJs::VERSION
  s.authors     = ["Gian Carlo Pace"]
  s.email       = %w(giancarlo.pace@gmail.com)
  s.homepage    = "http://www.fractalgarden.com"
  s.summary     = "A javascript popup menu plugin"
  s.description = "It's possible to use the generic popcorn and the app specific fat popcorn plugin"

  s.files = Dir["{app,config,db,lib}/**/*"] + %w(Rakefile README.md)

  s.add_dependency 'rails', '~> 3.2.1'
  s.add_dependency 'jquery-rails'
  s.add_development_dependency 'rspec-rails'
end
