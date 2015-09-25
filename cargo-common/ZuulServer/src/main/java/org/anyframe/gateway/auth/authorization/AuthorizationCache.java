package org.anyframe.gateway.auth.authorization;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;

public class AuthorizationCache {

    // inject the actual template
    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    // inject the template as ListOperations
    // can also inject as Value, Set, ZSet, and HashOperations
    @Resource(name="redisTemplate")
    private ListOperations<String, List<String>> listOps;

    public void addAuthorization(String token, List<String> authList) {
    	
        listOps.leftPush(token, authList);
        // or use template directly
        for(String auth: authList){
        	redisTemplate.boundListOps(token).leftPush(auth);
        }
    }
}
