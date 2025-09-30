variable "aws_account_id" {
  type = string
}

variable "app_id" {
  type = string
}

variable "environment" {
  type = string
}

variable "domain_app_name" {
  type        = string
  description = "url is structured like this: domain_app_name.domain_environment.foc.zone"
}

variable "domain_environment" {
  type        = string
  description = "url is structured like this: domain_app_name.domain_environment.foc.zone"
}
