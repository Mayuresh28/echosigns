import React, { useState } from 'react'
import {
  Box,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  Text,
  VStack,
  Container,
  useColorModeValue,
  Flex,
  Icon,
  Button,
  HStack,
} from '@chakra-ui/react'
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'
import helloVideo from '../assets/Hello.mp4'
import goodMorningVideo from '../assets/good morning.mp4'
import howAreYouVideo from '../assets/how are you.mp4'

const signLanguageWords = [
  {
    word: 'Hello',
    video: helloVideo,
    description: 'Raise your right hand near your head in a waving gesture.',
    color: 'blue.400',
  },
  {
    word: 'Good Morning',
    video: goodMorningVideo,
    description: 'Show a thumbs up (for "Good"), then move your dominant hand upward from under your other arm like a rising sun (for "Morning").',
    color: 'green.400',
  },
  {
    word: 'How Are You',
    video: howAreYouVideo,
    description: 'Place both hands on your upper chest, bring them downward smoothly, and then show a thumbs up (as in "OK?").',
    color: 'purple.400',
  },
]

export default function Learn() {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const location = useLocation();
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const videoRefs = React.useRef<(HTMLVideoElement | null)[]>([]);

  const speakWord = (word: string) => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel(); // Stop any current speech
      const utter = new window.SpeechSynthesisUtterance(word);
      window.speechSynthesis.speak(utter);
    }
  };

  const handlePlay = (idx: number) => {
    // Pause all videos first
    videoRefs.current.forEach((v, i) => {
      if (v && i !== idx) v.pause();
    });
    setPlayingIndex(idx);
    const video = videoRefs.current[idx];
    if (video) {
      video.currentTime = 0;
      video.play();
    }
  };

  return (
    <Box bg={bgColor} minH="100vh" py={10}>
      {/* Navbar */}
      <Flex as="nav" bg={cardBgColor} boxShadow="md" px={8} py={4} mb={8} borderRadius="xl" align="center" justify="center" gap={8}>
        <Button
          as={Link}
          to="/meetings"
          variant={location.pathname === '/meetings' ? 'solid' : 'ghost'}
          colorScheme={location.pathname === '/meetings' ? 'blue' : 'gray'}
          fontWeight="bold"
          size="lg"
          borderRadius="lg"
        >
          Meetings
        </Button>
        <Button
          as={Link}
          to="/learn"
          variant={location.pathname === '/learn' ? 'solid' : 'ghost'}
          colorScheme={location.pathname === '/learn' ? 'blue' : 'gray'}
          fontWeight="bold"
          size="lg"
          borderRadius="lg"
        >
          Learn
        </Button>
      </Flex>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading
              size="xl"
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
              fontWeight="extrabold"
            >
              Learn Sign Language
            </Heading>
            <Text mt={2} fontSize="xl" color={textColor}>
              Interactive lessons to help you master sign language
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {signLanguageWords.map((word, idx) => (
              <Card
                key={word.word}
                overflow="hidden"
                bg={cardBgColor}
                borderRadius="xl"
                boxShadow="xl"
                transition="transform 0.2s"
                _hover={{ transform: 'translateY(-5px)' }}
              >
                <CardBody>
                  <VStack spacing={4}>
                    <Heading
                      size="md"
                      bgGradient={`linear(to-r, ${word.color}, ${word.color.replace('400', '600')})`}
                      bgClip="text"
                    >
                      {word.word}
                    </Heading>
                    <Box
                      width="100%"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Box
                        as="video"
                        ref={el => videoRefs.current[idx] = el}
                        src={word.video}
                        style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '12px', background: '#18181b' }}
                        controls
                        playsInline
                        onEnded={() => setPlayingIndex(null)}
                        poster=""
                      />
                    </Box>
                    <Text color={textColor}>{word.description}</Text>
                    <HStack spacing={4}>
                      <Button
                        leftIcon={<Icon as={FaPlay} />}
                        variant="outline"
                        borderColor="blue.400"
                        color={textColor}
                        fontWeight="bold"
                        boxShadow="md"
                        borderRadius="lg"
                        bg={cardBgColor}
                        _hover={{
                          bgGradient: 'linear(to-r, blue.500, purple.600)',
                          color: 'white',
                          borderColor: 'blue.500',
                          transform: 'scale(1.07)',
                          boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
                        }}
                        _active={{
                          bgGradient: 'linear(to-r, blue.600, purple.700)',
                          color: 'white',
                          borderColor: 'blue.600',
                          transform: 'scale(0.98)',
                        }}
                        size="sm"
                        onClick={() => {
                          handlePlay(idx);
                          const video = videoRefs.current[idx];
                          if (video) {
                            video.muted = false;
                            video.volume = 1.0;
                          }
                        }}
                      >
                        Play
                      </Button>
                      <Button
                        leftIcon={<Icon as={FaVolumeUp} />}
                        variant="outline"
                        borderColor="blue.400"
                        color={textColor}
                        fontWeight="bold"
                        boxShadow="md"
                        borderRadius="lg"
                        bg={cardBgColor}
                        _hover={{
                          bgGradient: 'linear(to-r, blue.500, purple.600)',
                          color: 'white',
                          borderColor: 'blue.500',
                          transform: 'scale(1.07)',
                          boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
                        }}
                        _active={{
                          bgGradient: 'linear(to-r, blue.600, purple.700)',
                          color: 'white',
                          borderColor: 'blue.600',
                          transform: 'scale(0.98)',
                        }}
                        size="sm"
                        onClick={() => speakWord(word.word)}
                      >
                        Sound
                      </Button>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  )
}