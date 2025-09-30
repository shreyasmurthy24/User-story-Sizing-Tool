module "sizingtool-aws-s3-cloudfront-waf" {
  source = "git::https://github.com/foc-iac/terraform-aws-s3-cloudfront-waf?ref=5.4.0"

  # ----------------------------------------------------------------------------------------------------------------------
  # Required variables for AWS
  # ----------------------------------------------------------------------------------------------------------------------

  aws_account_id = var.aws_account_id
  aws_region     = "us-east-1" # DO NOT CHANGE. CloudFront is always in us-east-1

  # ----------------------------------------------------------------------------------------------------------------------
  # Standard Module Required Variables
  # ----------------------------------------------------------------------------------------------------------------------

  app_id           = var.app_id
  application_name = "sizing-tool"
  environment      = var.environment

  development_team_email        = "shreyasmurthychitloorkrishna@rocketclose.com"
  infrastructure_team_email     = "shreyasmurthychitloorkrishna@rocketclose.com"
  infrastructure_engineer_email = "shreyasmurthychitloorkrishna@rocketclose.com"

  # ----------------------------------------------------------------------------------------------------------------------
  # Module Variables
  # ----------------------------------------------------------------------------------------------------------------------

  #prefix = "ver1" # Uncomment to add a prefix to the resource names created in prefix-env-appid-appname format
  #suffix = "ver1" # Uncomment to add a suffix to the resource names created in env-appid-appname-suffix format


  website_domain_name = "${var.domain_app_name}.${var.domain_environment}.foc.zone"

  create_route53_entry        = false                                   # Set to 'false' to use xxx.cloudfront.net only.
  hosted_zone_name            = "${var.domain_environment}.foc.zone"   # dns zone that the 'website_domain_name' will be created in
  acm_certificate_domain_name = "" # Set to blank to if 'create_route53_entry' is false

  # Use the following settings to use xxxx.cloudfront.net WITHOUT custom domain names and WITHOUT https:
  # create_route53_entry        = false
  # hosted_zone_name            = ""
  # acm_certificate_domain_name = ""

  http_or_https_mode     = "redirect-to-https" # For http only use "allow-all"
  cloudfront_price_class = "PriceClass_100"

  # DANGER! Enable the following and run a 'plan' if you want to force destroy the site.
  # force_destroy_website = true

  min_ttl     = 0
  max_ttl     = 60
  default_ttl = 30

  index_document     = "index.html"
  error_document_404 = "index.html"
  error_document_500 = "index.html"

  default_root_object = "index.html"

  error_404_response_code = 200
  error_500_response_code = 500

  is_ipv6_enabled = false

  # What are the IP ranges I should allow? - https://git.rockfin.com/networkteam/RockFOCIPList/blob/main/rock-foc-ips.json
  allowed_external_ips = [
    "12.165.188.0/24",
    "162.252.136.0/21",
  ]

  cloudfront_forward_headers = [
    "Access-Control-Request-Headers",
    "Access-Control-Request-Method",
    "Origin",
  ]

  # When you wish to add a failover bucket to your Cloudfront distribution, use these variables
  # use_failover_bucket  = true
  # failover_bucket_name = "sizingtool-us-east-2.env.titletax-np.foc.zone"
}
