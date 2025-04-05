package com.seuprojeto.orcamento;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.util.TimeZone;

@SpringBootApplication
public class OrcamentoMoveisApplication {
	   private static final Logger logger = LoggerFactory.getLogger(OrcamentoMoveisApplication.class);
	   public static void main(String[] args){
		   try{
			   logger.info("Iniciando aplicação de Orçamento...");
			   SpringApplication.run(OrcamentoMoveisApplication.class, args);
			   logger.info("Aplicação iniciada com sucesso.");
		   } catch (Exception e){
			   logger.error("Erro ao iniciar a aplicação: ", e);
			   System.exit(1);
		   }
	   }


@Postconstruct
public void init(){
		   TimeZone.setDefault(TimeZone.getTimeZone("America/Sao_Paulo"));
		   logger.info("Fuso horário padrão definido para America/Sao_Paulo.");
                 }
}

