package org.anyframe.cloud.domain;

import org.joda.time.DateTime;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="user")
public class RegisteredUser {
	
	@Id
	private String id;
	
	@Indexed(unique=true)
	private String loginName;
	
	@Indexed(unique=true)
	private String emailAddress;
	
	private String firstName;
	
	private String lastName;
	
	private String mobilePhoneNo;
	
	@DBRef
	private Company company;
	
	@CreatedBy 
	private String createdBy;
	
	@CreatedDate
	private DateTime createdDate;
	
	@LastModifiedBy 
	private String lastModifiedBy;
	
	@LastModifiedDate
	private DateTime lastModifiedDate;
	
	public RegisteredUser(){}

	public RegisteredUser(String id, String loginName){
		this.id = id;
		this.loginName = loginName;
	}

	public RegisteredUser(String id, String loginName, String emailAddress){
		this.id = id;
		this.loginName = loginName;
		this.emailAddress = emailAddress;
	}
	
	public RegisteredUser(String id, String loginName, String emailAddress, String firstName,
			String lastName, String mobilePhoneNo,
			Company company) {
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

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public DateTime getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(DateTime createdDate) {
		this.createdDate = createdDate;
	}

	public String getLastModifiedBy() {
		return lastModifiedBy;
	}

	public void setLastModifiedBy(String lastModifiedBy) {
		this.lastModifiedBy = lastModifiedBy;
	}

	public DateTime getLastModifiedDate() {
		return lastModifiedDate;
	}

	public void setLastModifiedDate(DateTime lastModifiedDate) {
		this.lastModifiedDate = lastModifiedDate;
	}
	
}
