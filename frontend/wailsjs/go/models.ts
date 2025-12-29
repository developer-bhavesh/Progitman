export namespace main {
	
	export class Profile {
	    id: string;
	    name: string;
	    email: string;
	    username: string;
	    encryptedToken: string;
	    expiry: string;
	    pin: string;
	    isActive: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Profile(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.email = source["email"];
	        this.username = source["username"];
	        this.encryptedToken = source["encryptedToken"];
	        this.expiry = source["expiry"];
	        this.pin = source["pin"];
	        this.isActive = source["isActive"];
	    }
	}

}

