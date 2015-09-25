package org.anyframe.cloud.interfaces.facade.dto;

import org.anyframe.cloud.domain.Company;

public class UserResponse {
	
	private String id;
	
	private String loginName;
	
	private String emailAddress;
	
	private String firstName;
	
	private String lastName;
	
	private String mobilePhoneNo;
	
	private Company company;
	
	public UserResponse(){}
	
	public UserResponse(String id, String loginName, String emailAddress,
			String firstName, String lastName, String mobilePhoneNo, Company company) {
		this.id = id;
		this.loginName = loginName;
		this.emailAddress = emailAddress;
		this.firstName = firstName;
		this.lastName = lastName;
		this.mobilePhoneNo = mobilePhoneNo;
		this.company = company;
	}

	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public String getLoginName() {
		return loginName;
	}

	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}

	public String getEmailAddress() {
		return emailAddress;
	}
	
	public void setEmailAddress(String emailAddress) {
		this.emailAddress = emailAddress;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getMobilePhoneNo() {
		return mobilePhoneNo;
	}

	public void setMobilePhoneNo(String mobilePhoneNo) {
		this.mobilePhoneNo = mobilePhoneNo;
	}

	public Company getCompany() {
		return company;
	}

	public void setCompany(Company company) {
		this.company = company;
	}

}
