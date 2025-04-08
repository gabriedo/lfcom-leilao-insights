
import React from 'react';
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

const Contato = () => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Formulário enviado",
      description: "Entraremos em contato em até 24 horas.",
      duration: 5000,
    });
  };

  return (
    <Layout>
      <div className="bg-black text-white min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 bg-black border-b border-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Entre em Contato</h1>
              <p className="text-xl text-gray-300 mb-8">
                Estamos prontos para responder suas dúvidas e iniciar uma parceria de sucesso
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-gray-900 p-8 rounded-lg">
                <h2 className="text-2xl font-bold mb-6">Formulário de Contato</h2>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">Nome</label>
                        <Input id="name" required placeholder="Seu nome completo" className="bg-gray-800 border-gray-700 text-white" />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">E-mail</label>
                        <Input id="email" type="email" required placeholder="seu@email.com" className="bg-gray-800 border-gray-700 text-white" />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">Telefone</label>
                      <Input id="phone" placeholder="(00) 00000-0000" className="bg-gray-800 border-gray-700 text-white" />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">Assunto</label>
                      <Input id="subject" required placeholder="Assunto da mensagem" className="bg-gray-800 border-gray-700 text-white" />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">Mensagem</label>
                      <Textarea 
                        id="message" 
                        required
                        placeholder="Descreva como podemos ajudar..." 
                        className="bg-gray-800 border-gray-700 text-white min-h-[150px]" 
                      />
                    </div>
                    
                    <div>
                      <Button type="submit" className="w-full bg-white text-black hover:bg-gray-300">
                        <Send className="mr-2 h-4 w-4" />
                        Enviar Mensagem
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-6">Informações de Contato</h2>
                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 mr-4">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Telefone</h3>
                      <p className="text-gray-400">(11) 3456-7890</p>
                      <p className="text-gray-400">(11) 98765-4321</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 mr-4">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">E-mail</h3>
                      <p className="text-gray-400">contato@lfcom.com.br</p>
                      <p className="text-gray-400">assessoria@lfcom.com.br</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 mr-4">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Endereço</h3>
                      <p className="text-gray-400">Av. Paulista, 1000 - Bela Vista</p>
                      <p className="text-gray-400">São Paulo - SP, 01310-100</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 mr-4">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Horário de Atendimento</h3>
                      <p className="text-gray-400">Segunda a Sexta: 9h às 18h</p>
                      <p className="text-gray-400">Sábado: 9h às 13h</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10">
                  <h3 className="text-xl font-medium mb-4">Agende uma Consultoria</h3>
                  <p className="text-gray-400 mb-4">
                    Prefere agendar uma consultoria personalizada? Entre em contato conosco para definirmos o melhor horário.
                  </p>
                  <Button className="bg-white text-black hover:bg-gray-300">
                    <Phone className="mr-2 h-4 w-4" /> Agendar Consultoria
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="bg-gray-900 p-4 rounded-lg">
              <div className="aspect-[16/9] w-full bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Mapa de Localização</p>
                {/* Em um ambiente real, aqui seria inserido um iframe com o Google Maps ou outro serviço de mapas */}
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Contato;
